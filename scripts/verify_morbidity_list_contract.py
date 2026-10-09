"""Offline contract check for the paste-only Web Morbiditas list replacement.

No database/network access. It verifies the replacement uses one tenant-scoped,
non-deleted Morbiditas EXISTS scope for page, count, search, and pagination,
and exercises that scope against representative mocked rows.
"""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

REFERENCE = Path(r"C:/Data/Driya/final-api-logbook/ori/develop/06-10-2026/web.txt")
ARTIFACT = Path(r"C:/Data/Driya/final-api-logbook/actionGetListMorbidity.replacement.php")


def expect(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def has_morbiditas_activity(user_id: int, client_id: int, logbooks: list[dict], actions: dict[int, dict]) -> bool:
    """Mock the required EXISTS scope, including the legacy action-id fallback."""
    for logbook in logbooks:
        action = actions.get(logbook["id_action"])
        if (
            logbook["id_user"] == user_id
            and logbook["id_client"] == client_id
            and logbook["deleted_at"] is None
            and action is not None
            and action["id_client"] == client_id
            and (
                action.get("identifier", "").lower() == "morbiditas"
                or action.get("name", "").lower() == "morbiditas"
                or action["id"] == 39
            )
        ):
            return True
    return False


def main() -> None:
    source = ARTIFACT.read_text(encoding="utf-8")
    expect("public function actionGetListMorbidity()" in source, "replacement method missing")
    expect("FROM m_user u" in source, "user list query missing")
    expect("FROM t_logbook morbidity_lb" in source, "EXISTS logbook scope missing")
    for required in (
        "morbidity_lb.id_user = u.id",
        "morbidity_lb.id_client = u.id_client",
        "morbidity_lb.deleted_at IS NULL",
        "morbidity_action.id_client = morbidity_lb.id_client",
        "LOWER(COALESCE(morbidity_action.identifier, '')) = 'morbiditas'",
        "LOWER(COALESCE(morbidity_action.name, '')) = 'morbiditas'",
        "morbidity_action.id = 39",
        '$sql = "SELECT * FROM ({$baseSql}) AS x";',
        '$countSql = "SELECT COUNT(*) FROM ({$baseSql}) AS x";',
        "$sql .= $where;",
        "$countSql .= $where;",
        "LIMIT :limit OFFSET :offset",
    ):
        expect(required in source, f"required contract fragment missing: {required}")

    exists_index = source.index("FROM t_logbook morbidity_lb")
    base_end = source.index('";', source.index("$baseSql"))
    expect(exists_index < base_end, "EXISTS scope must be inside shared baseSql")

    actions = {
        10: {"id": 10, "id_client": 7, "identifier": "ordinary", "name": "Ordinary"},
        11: {"id": 11, "id_client": 7, "identifier": "morbiditas", "name": "Other"},
        12: {"id": 12, "id_client": 7, "identifier": "other", "name": "Morbiditas"},
        39: {"id": 39, "id_client": 7, "identifier": "legacy", "name": "Legacy"},
        13: {"id": 13, "id_client": 8, "identifier": "morbiditas", "name": "Morbiditas"},
    }
    cases = [
        ("points history only", 1, 7, [], False),
        ("ordinary logbook", 1, 7, [{"id_user": 1, "id_client": 7, "id_action": 10, "deleted_at": None}], False),
        ("deleted morbidity", 1, 7, [{"id_user": 1, "id_client": 7, "id_action": 11, "deleted_at": "2026-01-01"}], False),
        ("other tenant morbidity", 1, 7, [{"id_user": 1, "id_client": 8, "id_action": 13, "deleted_at": None}], False),
        ("identifier morbidity", 1, 7, [{"id_user": 1, "id_client": 7, "id_action": 11, "deleted_at": None}], True),
        ("name morbidity", 1, 7, [{"id_user": 1, "id_client": 7, "id_action": 12, "deleted_at": None}], True),
        ("legacy id 39", 1, 7, [{"id_user": 1, "id_client": 7, "id_action": 39, "deleted_at": None}], True),
    ]
    for name, user_id, client_id, logbooks, expected in cases:
        actual = has_morbiditas_activity(user_id, client_id, logbooks, actions)
        expect(actual == expected, f"mock EXISTS scope failed: {name}")

    php = shutil.which("php")
    expect(php is not None, "php executable is required for syntax verification")
    with tempfile.TemporaryDirectory() as directory:
        temp_controller = Path(directory) / "WebController.php"
        reference_controller = REFERENCE.read_text(encoding="utf-8")
        method_start = reference_controller.index("    public function actionGetListMorbidity()")
        method_end = reference_controller.index(
            "    public function actionGetListMorbidityByUser()", method_start
        )
        injected_controller = (
            reference_controller[:method_start] + source + "\n\n" + reference_controller[method_end:]
        )
        temp_controller.write_text(injected_controller, encoding="utf-8")
        result = subprocess.run([php, "-l", str(temp_controller)], text=True, capture_output=True)
        expect(result.returncode == 0, result.stdout + result.stderr)

    expect(REFERENCE.exists(), "reference controller artifact is unavailable")
    print("PASS: static shared-EXISTS contract, mocked scopes, and injected PHP lint")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)
