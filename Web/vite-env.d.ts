/// <reference types="vite/client" />

// Khai báo module cho các file ảnh (để TS hiểu rằng chúng là chuỗi URL)
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
    const src: string;
    export default src;
}
declare module '*.svg' {
    const src: string;
    export default src;
}