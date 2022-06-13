import { cubicInOut } from "svelte/easing";

export function slideSideIn(..._){
  return {
    duration: 600,
    easing: cubicInOut,
    css: (_, t) => `left: ${t*616}px`
  };
}

export function slideSideOut(..._){
  return {
    duration: 600,
    easing: cubicInOut,
    css: (_, t) => `left: ${0-t*616}px`
  };
}

export function slideUpIn(_, { duration = 400 }){
  return {
    duration,
    easing: cubicInOut,
    css: (t) => `top: calc(-100vh + ${t} * 100vh)`
  };
}

export function slideUpOut(_, { duration = 400 }){
  return {
    duration,
    easing: cubicInOut,
    css: (_, t) => `top: calc(${t} * 100vh)`
  };
}

export function slideDownIn(node, { duration = 400 }){
  return {
    duration,
    easing: cubicInOut,
    css: (t) => `top: calc(100vh - ${t} * 100vh)`
  };
}

export function slideDownOut(node, { duration = 400 }){
  return {
    duration,
    easing: cubicInOut,
    css: (_, t) => `top: calc(${-t} * 100vh)`
  };
}
