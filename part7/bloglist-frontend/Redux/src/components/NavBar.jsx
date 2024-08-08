import { LoggedInUser } from './LoggedInUser';
import { useSelector } from 'react-redux';
const selectUser = (state) => state.user;


export const NavBar = () => {
    const user = useSelector(selectUser);
    if (!user) return null;
    return (
        <div className='nav-bar'>
            <a href="/">blogs</a>&nbsp;
            <a href="/users">users</a>&nbsp;
            <LoggedInUser user={user} />
        </div>
    )

}