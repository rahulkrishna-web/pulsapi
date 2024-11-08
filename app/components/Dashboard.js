import {useAppBridge} from '@shopify/app-bridge-react';

const Dashboard = () => {
    const shopify = useAppBridge();
    function generateBlogPost() {
        // Handle generating
        shopify.toast.show('Blog post template generated');
      }
    return(
        <div>Dashboard
            <button onClick={generateBlogPost}>Generate Blog Post</button>
        </div>
    )
}

export default Dashboard;