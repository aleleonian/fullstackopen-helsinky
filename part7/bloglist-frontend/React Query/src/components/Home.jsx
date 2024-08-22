import { useContext } from 'react';
import BlogContext from '../BlogContext';
import { LoginData } from './LoginData';
import { LoginForm } from "./LoginForm";
import { BlogList } from './BlogList';

export function Home() {
    const { state, dispatch } = useContext(BlogContext);

    if (state.user) {
        const blogListData = BlogList();
        return (
            <>
                <LoginData />
                {blogListData}
            </>
        )
    }
    else return <LoginForm />;
}