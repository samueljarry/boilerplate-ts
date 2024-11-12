import '@styles/styles.scss';
import { useEffect, useState } from 'react';
import { Main } from './Main';
import { ViewsManager } from './core/common/managers/ViewsManager';
import { ViewTypes } from './core/common/constants/views/ViewTypes';

export const App = () => {
  const [init, setInit] = useState(Main.IsInit);
  const [views, setViews] = useState();

  useEffect(() => {
    const onInit = () => {
      setInit(Main.IsInit);
      Main.Start();
    }

    const onViewsChange = () => {
      let displayedViews = []
      for(const view of ViewsManager.GetDisplayedViews().values()) {
        if(view.type === ViewTypes.REACT) {
          displayedViews.push(<view.component viewId={view.viewId} key={view.viewId} />)
        }
      }
      setViews(displayedViews)
    }
    
    onInit();
    onViewsChange();

    Main.OnInit.add(onInit);
    ViewsManager.OnViewsChange.add(onViewsChange);

    return () => {
      Main.OnInit.remove(onInit);
      ViewsManager.OnViewsChange.remove(onViewsChange);
    }
  }, [])

  return (
    <>
      { !init && <span>Loading...</span>}
      { init && views}
    </>
  )
}
