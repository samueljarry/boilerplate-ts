import { ReactView, ReactViewProps } from '@core/common/bases/views/react/ReactView';
import { useEffect, useRef } from 'react';

import { MainThree } from '../MainThree';

export const MainThreeView = (props: ReactViewProps) => {
  const canvasContainer = useRef();  

  useEffect(() => {
    MainThree.SetDomElementContainer(canvasContainer.current);
    MainThree.Start();

    return () => {
      MainThree.Stop();
    }
  }, []);

  return (
    <ReactView {...props}>
      <div ref={canvasContainer} className="three-container" />
    </ReactView>
  )
}