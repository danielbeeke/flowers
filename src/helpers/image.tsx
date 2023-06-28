export const image = (url: string, width: number, height: number, alt: string) => {
    return <img alt={alt} src={`//wsrv.nl/?url=${url}&w=${width * 2}&h=${height * 2}&fit=cover&a=attention`} width={width} height={height} />
}