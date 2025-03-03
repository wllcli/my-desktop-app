import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd'
import RootApp from './root'
import 'normalize.css';
const root = createRoot(document.body);
root.render(<RootApp/>);