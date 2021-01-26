export const PROXY_PREFIX = "https://proxy.veld.workers.dev/?url=";
export default async function(url: string, method: string = "GET") {
    return fetch(`https://proxy.veld.workers.dev/?url=${url}`, {
        method,
    })
}