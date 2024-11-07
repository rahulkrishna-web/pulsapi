import {useAppBridge} from '@shopify/app-bridge-react';

const TestBridge = () => {
    const shopify = useAppBridge();
    return(
        <div>Test {shopify.config.shop}</div>
    )
}

export default TestBridge;