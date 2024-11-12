import { ReactView } from '@core/common/bases/views/react/ReactView';
import { MainThree } from '../MainThree';
import { useEffect, useRef } from 'react';

export const MainThreeView = (props) => {
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