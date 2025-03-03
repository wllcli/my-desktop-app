import { ConfigProvider } from "antd";
import TomatoClock from './components/tomato/TomatoClock'
export default function RootApp() {
  return (
    <ConfigProvider>
        <TomatoClock />
    </ConfigProvider>
  )
}
