// 编写一个番茄计时器卡片
import { TomatoWrapper } from './tomato.style'
export default function TomatoClock() {
  return <TomatoWrapper>
    <div className='left'>
      <div className='left-top'>
        left top
      </div>
      <div className='left-bottom'>
        left bottom
      </div>
    </div>
    <div className='right'></div>
  </TomatoWrapper>;
}
