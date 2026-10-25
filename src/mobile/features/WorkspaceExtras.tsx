import { useMobileSession } from '../session';
import { mobileRole } from './extras/contracts';
import { Explore } from './extras/Explore';
import { Milestone } from './extras/Milestone';
import { Profile } from './extras/Profile';
import { Frame } from './extras/shared';
import './extras/extras.css';

/** Mount inside the shared /mobile authenticated shell. No component props required. */
export function MobileExplore() {
  const user=useMobileSession(state=>state.user);
  if (!user) return null;
  if (mobileRole(user)!=='staff') return <Frame title="Explore PPDS"><p>Explore tersedia untuk Staff.</p></Frame>;
  return <Explore key={`${user.id}:${user.id_client}`} user={{...user}}/>;
}
export function MobileMilestone() {
  const user=useMobileSession(state=>state.user);
  if (!user) return null;
  if (mobileRole(user)==='excluded') return <Frame title="Milestone"><p>Role tidak diizinkan untuk workspace mobile.</p></Frame>;
  return <Milestone key={`${user.id}:${user.id_client}`} user={{...user}}/>;
}
export function MobileProfile() {
  const user=useMobileSession(state=>state.user);
  if (!user) return null;
  if (mobileRole(user)==='excluded') return <Frame title="Profil"><p>Role tidak diizinkan untuk workspace mobile.</p></Frame>;
  return <Profile key={`${user.id}:${user.id_client}`} user={{...user}}/>;
}
