import { LoggedInUser } from './LoggedInUser';
import { useContext } from 'react';
import BlogContext from '../BlogContext';


export const NavBar = () => {
    const { state, dispatch } = useContext(BlogContext);
    if (!state.user) return null;
    return (
        <div className='nav-bar'>
            <a href="/">blogs</a>&nbsp;
            <a href="/users">users</a>&nbsp;
            <LoggedInUser user={state.user} />
        </div>
    )
}