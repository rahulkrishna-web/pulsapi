import {useAppBridge} from '@shopify/app-bridge-react';

const Dashboard = () => {
    const shopify = useAppBridge();
    return(
        <div>Dashboard</div>
    )
}

export default Dashboard;