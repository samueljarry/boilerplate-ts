import { AnimationAction } from "three"

export const fadeAnimations = (previousAction: AnimationAction, nextAction: AnimationAction, duration = 0.5): void => {
  if(previousAction === nextAction) return;
  previousAction.fadeOut(duration);
  nextAction.reset();
  nextAction.fadeIn(duration);
  nextAction.play();
}