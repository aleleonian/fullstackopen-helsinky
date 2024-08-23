import { useContext } from 'react';
import BlogContext from '../BlogContext';
import { LoginData } from './LoginData';
import { LoginForm } from "./LoginForm";
import { BlogList } from './BlogList';

export function Home() {
    const { state, dispatch } = useContext(BlogContext);

    if (state.user) {
        return (
            <>
                <BlogList />
            </>
        )
    }
    else return <LoginForm />;
}