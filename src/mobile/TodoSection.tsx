import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import Select from "react-select";
import { mobileRequest } from "./api";
import { todoTriage } from "./foundationPresentation";
import { formatDateTimeValue } from "./formatDateTime";
import { auditScreenVisit } from "./useNavigationAudit";
import { readHomeMenus, requireRows } from "./foundationReads";
import {
  actorKey,
  captureReturn,
  readListMemory,
  readListWindow,
  saveListWindow,
  forgetListMemory,
} from "./navigation";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { InfiniteScrollFooter } from "./InfiniteScrollFooter";
import { useListPosition } from "./useListPosition";
import { useMobileSession } from "./session";
import {
  mergeTodoRows,
  parseTodoPage,
  todoFilters,
  todoQuery,
  TODO_PAGE_SIZE,
} from "./todo";
type Row = Record<string, any>;
export default function TodoSection({
  full = false,
  menuActions,
}: {
  full?: boolean;
  menuActions?: Row[];
}) {
  const user = useMobileSession((s) => s.user)!;
  const [search, setSearch] = useSearchParams();
  const location = useLocation();
  const queryKey = search.toString();
  const appliedKey = todoQuery(
    todoFilters(new URLSearchParams(queryKey)),
  ).toString();
  const filters = useMemo(
    () => todoFilters(new URLSearchParams(appliedKey)),
    [appliedKey],
  );
  const urlPage = Number(search.get("page"));
  const requestedPage =
    full && Number.isSafeInteger(urlPage) && urlPage > 0 ? urlPage : 1;
  const requestLimit = full ? TODO_PAGE_SIZE : 4;
  const [draft, setDraft] = useState<Row>(filters);
  const [reload, setReload] = useState(0);
  const [masterAttempt, setMasterAttempt] = useState(0);
  const [masterBusy, setMasterBusy] = useState(true);
  const [masterError, setMasterError] = useState("");
  const [dateError, setDateError] = useState("");
  useEffect(() => {
    setDraft(filters);
    setDateError("");
  }, [filters, user.id, user.id_client, user.role]);
  function applyFilters(next: Row) {
    const query = todoQuery(next);
    setDraft(todoFilters(query));
    setDateError("");
    setPreview(null);
    if (query.toString() === queryKey) {
      forgetListMemory("todo");
      saveListWindow(actorKey(user), location.pathname + location.search, 1, 0);
      setReload((n) => n + 1);
    } else setSearch(query);
  }
  function applyDraft() {
    if (
      draft.start_date &&
      draft.end_date &&
      draft.start_date > draft.end_date
    ) {
      setDateError("Tanggal akhir harus sama atau setelah tanggal awal.");
      return;
    }
    applyFilters(draft);
  }
  const [actions, setActions] = useState<Row[]>([]);
  const [ppdsOptions, setPpdsOptions] = useState<Row[]>([]);
  const [stages, setStages] = useState<Row[]>([]);
  const [todos, setTodos] = useState<Row[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [paginated, setPaginated] = useState(true);
  const [visibleCount, setVisibleCount] = useState(TODO_PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState("");
  const [loadedScope, setLoadedScope] = useState("");
  const moreLock = useRef(false);
  const [hasMore, setHasMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<Row | null>(null);
  const listKey = `${actorKey(user)}:${location.pathname}${location.search}`;
  const rememberList = useListPosition(
    full ? "todo" : "home",
    listKey,
    actorKey(user),
    { page },
    true,
    !busy && total !== null,
  );
  const sequence = useRef(0);
  const scopeKey = `${actorKey(user)}:${full}:${appliedKey}:${reload}`;
  const currentScope = useRef(scopeKey);
  currentScope.current = scopeKey;
  const mutationLock = useRef(false);
  const identity = { id_user: user.id, id_client: user.id_client };
  const loadTodo = useCallback(async () => {
    const request = ++sequence.current;
    const scope = scopeKey;
    const current = () =>
      request === sequence.current &&
      currentScope.current === scope &&
      useMobileSession.getState().user?.id === user.id &&
      useMobileSession.getState().user?.id_client === user.id_client;
    setBusy(true);
    setError("");
    setMoreError("");
    setPreview(null);
    setLoadingMore(false);
    moreLock.current = false;
    setTodos([]);
    setTotal(null);
    setHasMore(false);
    try {
      const saved = full
        ? (readListMemory<{ page: number }>("todo", listKey)?.value.page ??
          readListWindow(actorKey(user), location.pathname + location.search)
            ?.page ??
          requestedPage)
        : 1;
      let parsed = parseTodoPage(
        await mobileRequest("getTodo", {
          id_user: user.id,
          id_client: user.id_client,
          ...filters,
          page: 1,
          limit: requestLimit,
        }),
        1,
        requestLimit,
      );
      if (!current()) return;
      while (
        parsed.paginated &&
        parsed.hasMore &&
        parsed.page < Math.min(saved, 100)
      ) {
        const next = parseTodoPage(
          await mobileRequest("getTodo", {
            id_user: user.id,
            id_client: user.id_client,
            ...filters,
            page: parsed.page + 1,
            limit: requestLimit,
          }),
          parsed.page + 1,
          requestLimit,
        );
        if (!current()) return;
        const merged = mergeTodoRows(parsed.rows, next.rows);
        if (
          next.page <= parsed.page ||
          (next.hasMore && merged.length === parsed.rows.length)
        )
          throw new Error("Server mengulang halaman. Coba lagi.");
        parsed = { ...next, rows: merged };
      }
      setLoadedScope(scope);
      setTodos(parsed.rows);
      setTotal(parsed.total);
      setPage(parsed.paginated ? parsed.page : saved);
      setVisibleCount(Math.max(1, saved) * TODO_PAGE_SIZE);
      setPaginated(parsed.paginated);
      setHasMore(parsed.hasMore);
    } catch (e) {
      if (current()) setError((e as Error).message);
    } finally {
      if (current()) setBusy(false);
    }
  }, [scopeKey]);
  useEffect(() => {
    loadTodo();
    return () => {
      sequence.current++;
    };
  }, [loadTodo]);
  async function loadMore() {
    if (moreLock.current || busy || loadingMore || !full || preview) return;
    if (!paginated) {
      setVisibleCount((n) => n + TODO_PAGE_SIZE);
      setPage((n) => n + 1);
      return;
    }
    if (!hasMore) return;
    moreLock.current = true;
    setLoadingMore(true);
    setMoreError("");
    const token = sequence.current,
      scope = scopeKey;
    const current = () =>
      token === sequence.current && currentScope.current === scope;
    try {
      const next = parseTodoPage(
        await mobileRequest("getTodo", {
          ...identity,
          ...filters,
          page: page + 1,
          limit: requestLimit,
        }),
        page + 1,
        requestLimit,
      );
      if (!current()) return;
      const merged = mergeTodoRows(todos, next.rows);
      if (next.page <= page || (next.hasMore && merged.length === todos.length))
        throw new Error(
          "Server mengulang halaman tanpa kegiatan baru. Coba lagi.",
        );
      setTodos(merged);
      setPage(next.page);
      setHasMore(next.hasMore);
      setTotal(next.total);
    } catch (e) {
      if (current()) setMoreError((e as Error).message);
    } finally {
      if (current()) {
        moreLock.current = false;
        setLoadingMore(false);
      }
    }
  }
  const more = paginated ? hasMore : visibleCount < todos.length;
  const infinite = useInfiniteScroll({
    restored:
      !!readListMemory("todo", listKey) ||
      !!readListWindow(actorKey(user), location.pathname + location.search),
    enabled:
      full &&
      loadedScope === scopeKey &&
      more &&
      !busy &&
      !error &&
      !moreError &&
      !preview,
    loading: loadingMore,
    scopeKey,
    progressKey: `${page}:${todos.length}:${visibleCount}`,
    onLoadMore: loadMore,
  });
  useEffect(() => {
    let live = true;
    setMasterBusy(true);
    setMasterError("");
    setActions([]);
    setPpdsOptions([]);
    setStages([]);
    Promise.all([
      menuActions === undefined
        ? readHomeMenus(user, mobileRequest, () => live)
        : Promise.resolve({ filtered: menuActions }),
      mobileRequest("getMasterPpds", { id_client: user.id_client }),
      mobileRequest("getMasterSemester", { id_client: user.id_client }),
    ])
      .then(([actions, ppds, semester]) => {
        if (live) {
          setActions(actions.filtered);
          setPpdsOptions(requireRows(ppds, "peserta PPDS"));
          setStages(
            Array.from(
              new Map(
                requireRows(semester, "semester")
                  .filter((s: Row) => s.id_stage && s.m_stage?.name)
                  .map((s: Row) => [
                    s.id_stage,
                    { id: s.id_stage, name: s.m_stage.name },
                  ]),
              ).values(),
            ) as Row[],
          );
        }
      })
      .catch((e) => {
        if (live) setMasterError(e.message);
      })
      .finally(() => {
        if (live) setMasterBusy(false);
      });
    return () => {
      live = false;
    };
  }, [
    user.id,
    user.id_client,
    user.role,
    user.id_semester,
    masterAttempt,
    menuActions,
  ]);
  async function verify(previewOnly: boolean) {
    if (mutationLock.current) return;
    mutationLock.current = true;
    setBusy(true);
    setError("");
    const context = sequence.current;
    try {
      const result = await mobileRequest("verifyAllTodo", {
        ...identity,
        ...filters,
        ...(previewOnly ? { preview: true } : {}),
      });
      if (context !== sequence.current) return;
      if (previewOnly) {
        if (!Number.isFinite(Number(result.verified)))
          throw new Error("Server tidak mengembalikan jumlah preview.");
        setPreview(result);
      } else {
        setPreview(null);
        setNotice(result.message || `${result.verified} logbook diverifikasi.`);
        applyFilters({});
        window.dispatchEvent(new Event("mobile:notifications-refresh"));
      }
    } catch (e) {
      if (context === sequence.current) setError((e as Error).message);
    } finally {
      mutationLock.current = false;
      if (context === sequence.current) setBusy(false);
    }
  }
  const hospitals = Array.from(
    new Map(
      actions.flatMap((a) => {
        const values = a.hospitals ?? a.m_hospital;
        return Array.isArray(values)
          ? values.flatMap((h: Row) => {
              const nested = h.m_hospital ?? h.m_action ?? h.m_stage;
              const id = Number(
                h.id ??
                  h.id_action ??
                  h.id_hospital ??
                  h.id_stage ??
                  nested?.id,
              );
              const label =
                h.display_name ?? h.name ?? h.action_name ?? nested?.name;
              return Number.isFinite(id) &&
                typeof label === "string" &&
                label.trim()
                ? [[id, { id, label: label.trim() }] as const]
                : [];
            })
          : [];
      }),
    ).values(),
  );
  const source = location.pathname + (queryKey ? `?${queryKey}` : "");
  const displayRows = full
    ? paginated
      ? todos
      : todos.slice(0, visibleCount)
    : todos.slice(0, requestLimit);
  const start = displayRows.length ? 1 : 0;
  const end = displayRows.length;
  const skippedPreview = preview
    ? Number(preview.skipped_score || 0) +
      Number(preview.skipped_special || 0) +
      Number(preview.skipped_sequential || 0)
    : 0;
  return (
    <section
      className={`mobile-todo${full ? " mobile-todo-full" : ""}`}
      aria-busy={busy}
    >
      <div
        className={full ? "mobile-todo-page-heading" : "mobile-section-heading"}
      >
        <div className={full ? "mobile-todo-page-identity" : undefined}>
          {full && (
            <Link
              className="mobile-todo-back"
              aria-label="Kembali ke Home"
              title="Kembali ke Home"
              to={`/mobile${todoQuery(filters).toString() ? "?" + todoQuery(filters) : ""}`}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </Link>
          )}
          <div>
            <p className="mobile-eyebrow">Verifikasi</p>
            {full ? (
              <div className="mobile-todo-title">
                <h1>Semua To Do</h1>
                {total !== null && (
                  <span className="mobile-badge" aria-label={`${total} To Do`}>
                    {total}
                  </span>
                )}
              </div>
            ) : (
              <h2>
                To Do{" "}
                {total !== null && (
                  <span className="mobile-badge">{total}</span>
                )}
              </h2>
            )}
          </div>
        </div>
        <button disabled={busy || !todos.length} onClick={() => verify(true)}>
          Verify All
        </button>
      </div>
      {full && (
        <p className="mobile-todo-range" aria-live="polite">
          Menampilkan {start}–{end} dari {total ?? "jumlah belum tersedia"} To
          Do
        </p>
      )}
      {full && (
        <p className="mobile-todo-summary" aria-live="polite">
          {displayRows.length} item dimuat 
        </p>
      )}
      {error && (
        <div className="mobile-error" role="alert">
          {error}
          <button onClick={loadTodo}>Coba lagi</button>
        </div>
      )}
      {notice && (
        <p role="status" className="mobile-notice">
          {notice}
        </p>
      )}
      {busy && (
        <p role="status" className="mobile-todo-loading">
          <LoaderCircle className="mobile-spinner" size={18} /> Memuat To Do…
        </p>
      )}
      <details
        className="mobile-panel mobile-todo-filters"
        onToggle={(event) => {
          if (full)
            auditScreenVisit(
              event.currentTarget.open
                ? "home/staff-todo-filter"
                : "home/staff-todo",
            );
        }}
      >
        <summary>
          <span>Filter To Do</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <div className="mobile-filter-grid">
          <div className="mobile-todo-ppds">
            <label htmlFor="todo-ppds">Peserta PPDS</label>
            <Select
              inputId="todo-ppds"
              instanceId="todo-ppds"
              isMulti
              classNamePrefix="todo-ppds"
              aria-label="Peserta PPDS"
              placeholder="Cari peserta PPDS…"
              isDisabled={masterBusy || !!masterError}
              isLoading={masterBusy}
              closeMenuOnSelect
              blurInputOnSelect
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : undefined
              }
              menuPosition="fixed"
              maxMenuHeight={220}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                control: (base) => ({
                  ...base,
                  minHeight: 48,
                  borderRadius: 11,
                  borderColor: "#cddfd5",
                  boxShadow: "none",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#eaf6ef" : "white",
                  color: "#153c2b",
                }),
                multiValue: (base) => ({ ...base, backgroundColor: "#eaf6ef" }),
              }}
              options={ppdsOptions
                .filter(
                  (p) =>
                    /^[1-9][0-9]*$/.test(String(p.id)) &&
                    Number.isSafeInteger(Number(p.id)),
                )
                .map((p) => ({
                  value: Number(p.id),
                  label: p.display_name || p.name || String(p.id),
                  search: [p.display_name, p.name, p.code, p.username]
                    .filter(Boolean)
                    .join(" "),
                }))}
              filterOption={(option, query) =>
                option.data.search
                  .toLocaleLowerCase()
                  .includes(query.toLocaleLowerCase())
              }
              value={(draft.ppds_ids || []).map((id: number) => {
                const p = ppdsOptions.find((p) => Number(p.id) === id);
                return {
                  value: id,
                  label: p?.display_name || p?.name || String(id),
                  search: "",
                };
              })}
              onChange={(values) =>
                setDraft((f) => ({
                  ...f,
                  ppds_ids: values.map((v) => v.value),
                }))
              }
              noOptionsMessage={() => "Tidak ada peserta PPDS yang cocok."}
              loadingMessage={() => "Memuat peserta PPDS…"}
            />
            {masterBusy && <small role="status">Memuat pilihan filter…</small>}
            {masterError && (
              <div className="mobile-error" role="alert">
                {masterError}
                <button onClick={() => setMasterAttempt((n) => n + 1)}>
                  Muat ulang pilihan filter
                </button>
              </div>
            )}
          </div>
          <label>
            Tahap
            <select
              value={draft.id_stage || ""}
              onChange={(e) =>
                setDraft((f) => ({
                  ...f,
                  id_stage: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">Semua</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Logbook
            <select
              value={draft.id_action || ""}
              onChange={(e) =>
                setDraft((f) => ({
                  ...f,
                  id_action: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
            >
              <option value="">Semua</option>
              {actions.map((a) => (
                <option key={a.id_action ?? a.id} value={a.id_action ?? a.id}>
                  {a.action_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rumah sakit
            <select
              value={draft.id_hospital || ""}
              onChange={(e) =>
                setDraft((f) => ({
                  ...f,
                  id_hospital: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
            >
              <option value="">Semua</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Dari tanggal
            <input
              type="date"
              value={draft.start_date || ""}
              onChange={(e) =>
                setDraft((f) => ({
                  ...f,
                  start_date: e.target.value || undefined,
                }))
              }
            />
          </label>
          <label>
            Sampai tanggal
            <input
              type="date"
              value={draft.end_date || ""}
              onChange={(e) =>
                setDraft((f) => ({
                  ...f,
                  end_date: e.target.value || undefined,
                }))
              }
            />
          </label>
          {dateError && (
            <p className="mobile-error" role="alert">
              {dateError}
            </p>
          )}
          <div className="mobile-actions">
            <button
              className="mobile-primary"
              disabled={mutationLock.current}
              onClick={applyDraft}
            >
              Terapkan filter
            </button>
            <button
              disabled={mutationLock.current}
              onClick={() => applyFilters({})}
            >
              Reset filter
            </button>
          </div>
        </div>
      </details>
      <div className="mobile-todo-list">
        {displayRows.map((t) => (
          <Link
            className="mobile-todo-card"
            key={t.id}
            onClick={() => {
              rememberList();
              saveListWindow(actorKey(user), source, page, window.scrollY);
              captureReturn(user, location);
            }}
            state={{ mobileReturn: captureReturn(user, location) }}
            to={`/mobile/logbooks/${t.id_action}/${t.id}?returnTo=${encodeURIComponent(source)}`}
          >
            <span className="mobile-menu-icon">
              <ClipboardCheck />
            </span>
            <div>
              <strong>{t.title || t.m_action?.name || "Logbook"}</strong>
              <p>{t.m_user?.display_name || t.m_ppds?.display_name || "-"}</p>
              <small>
                {formatDateTimeValue(
                  t.date || t.datetime || t.created_date || t.updated_date,
                )}
              </small>
              {full && (
                <div className="mobile-todo-triage">
                  <span>
                    Semester: <strong>{todoTriage(t).semester}</strong>
                  </span>

                </div>
              )}
            </div>
            <ChevronRight />
          </Link>
        ))}
      </div>
      {!busy && !error && !todos.length && (
        <div className="mobile-empty">
          <ClipboardCheck size={34} />
          <h3>Belum ada To Do</h3>
          <p>Tidak ada logbook yang menunggu verifikasi pada filter ini.</p>
        </div>
      )}
      {full
        ? more && (
            <InfiniteScrollFooter
              sentinelRef={infinite.sentinelRef}
              loading={loadingMore}
              error={moreError}
              onLoadMore={() => void loadMore()}
            />
          )
        : (hasMore ||
            todos.length > requestLimit ||
            (total !== null && total > displayRows.length)) && (
            <Link
              className="mobile-todo-more"
              to={`/mobile/todo${todoQuery(filters).toString() ? "?" + todoQuery(filters) : ""}`}
            >
              Lihat lebih banyak <ChevronRight size={18} />
            </Link>
          )}
      {preview && (
        <div className="mobile-modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="verify-title"
            className="mobile-modal"
          >
            <h2 id="verify-title">Konfirmasi Verify All</h2>
            <p>
              {Number(preview.verified) > 0
                ? `Sebanyak ${preview.verified} logbook akan diverifikasi.${skippedPreview > 0 ? ` ${skippedPreview} logbook tetap perlu diproses satu per satu.` : ""}`
                : "Tidak ada logbook yang dapat diverifikasi otomatis. To Do yang tersisa perlu diproses satu per satu."}
            </p>
            <div className="mobile-actions">
              <button disabled={busy} onClick={() => setPreview(null)}>
                Batal
              </button>
              <button
                className="mobile-primary"
                disabled={busy || Number(preview.verified) < 1}
                onClick={() => verify(false)}
              >
                {busy ? "Memverifikasi…" : "Ya, verifikasi"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
