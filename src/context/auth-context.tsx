import React, { ReactNode, useCallback } from 'react';
import * as auth from 'auth-provider';
import { User } from 'types/user'
import { http } from 'utils/http';
import { useMount } from 'utils';
import { useAsync } from 'utils/use-async';
import { FullPageError, FullPageLoading } from 'components/lib';
import * as authStore from 'store/auth.slice'
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom'

export interface AuthForm {
    username: string;
    password: string;
}

export const bootstrapUser = async () => {
    let user = null
    const token = auth.getToken();
    if (token) {
        const data = await http('me', { token });
        user = data.user
    }
    return user
}

const AuthContext = React.createContext<{
    user: User | null;
    login: (form: AuthForm) => Promise<void>;
    register: (form: AuthForm) => Promise<void>;
    logout: () => void;
} | undefined>(undefined);

AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const { data: user, setData: setUser, error, isLoading, isIdle, isError, run } = useAsync<User | null>()

    // point free
    // const login = (form: AuthForm) => auth.login(form).then(setUser);
    // const register = (form: AuthForm) => auth.register(form).then(setUser);
    // const logout = () => auth.logout().then(() => setUser(null));

    const dispatch: (...args: unknown[]) => Promise<User> = useDispatch()

    useMount(() => {
        // run(bootstrapUser())
        run(dispatch(authStore.bootstrap()))
    })

    if (isIdle || isLoading) {
        return <FullPageLoading />
    }

    if (isError) {
        return <FullPageError error={error}/>
    }

    // return <AuthContext.Provider value={{ user, login, register, logout }} children={children} />

    return (
        <Router>
            {children}
        </Router>
    )

}

export const useAuth = () => {
    // const context = React.useContext(AuthContext);
    // if (!context) {
    //     throw new Error('useAuth必须在 AuthProvider中使用')
    // }

    // return context

    const queryClient = useQueryClient()

    const dispatch: (...args: unknown[]) => Promise<User> = useDispatch()
    const user = useSelector(authStore.selectUser)
    const login = useCallback((form: AuthForm) => dispatch(authStore.login(form)), [dispatch])
    const register = useCallback((form: AuthForm) => dispatch(authStore.register(form)), [dispatch])
    const logout = useCallback(() => {
        queryClient.clear()
        dispatch(authStore.logout())
    }, [dispatch])

    return {
        user,
        login,
        register,
        logout
    }

}
    

    