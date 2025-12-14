export enum AnimationModeEnum {
  CSS = 'CSS',
  WebAnimationsAPI = 'Web Animations API',
  RequestAnimationFrame = 'requestAnimationFrame',
}

export type MenuNode = {
  key: string
  text: string
  children?: MenuNode[]
}
