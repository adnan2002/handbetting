import { Navigate } from 'react-router'
import useGameStore from '../store/useGameStore'

export default function withUserStatus(Component: React.ComponentType<any>) {
    return function WithUserStatus(props: any) {
        const userStatus = useGameStore(s => s.getUserStatus())

        if (userStatus === 'not_signed_in') {
            return <Navigate to="/signin" replace />
        }

        return <Component {...props} />
    }
}