import { Embed } from "@/models";
import { PROXY_PREFIX } from "./proxyfetch";

let parser: DOMParser = null;

export const mapToEmbed = async (httpResponse: Response) => {
    const contentType = httpResponse.headers.get("content-type");
    httpResponse.headers.forEach((k, v) => console.log(k, "-", v));
    if(!contentType) {
        return null;
    }
    console.log(httpResponse.url);
    if(contentType.startsWith("image")) {
        return {
            thumbnailUrl: httpResponse.url,
        }
    } else if(contentType.startsWith("text")) {
        return await getEmbedFromHtml(httpResponse);
    }
    return null;
}

const getEmbedFromHtml = async (res: Response): Promise<Embed> => {
    const html = await res.text();
    if(parser == null) { 
        parser = new DOMParser();
    }
    let parsedHtml = parser.parseFromString(html, 'text/html');
    let metaTags = parsedHtml.head.getElementsByTagName("meta");

    let embed: Embed = {};
    for(let i = 0; i < metaTags.length; i++) {
        let tag = metaTags.item(i);
        let name = tag.name || tag.getAttribute("property") || tag.getAttribute("itemprop");
        if(!name) {
            continue;
        }

        switch(name) {
            case "og:title":
            case "name": {
                if(!embed.title) {
                    continue;
                }

                embed.title = tag.getAttribute("content");
                break;
            }

            case "og:description":
            case "description": {
                embed.description = tag.getAttribute("content");
                break;
            }

            case "og:image": 
            case "image": {
                let imageUrl = tag.getAttribute("content");

                if(imageUrl.startsWith("/")) {
                    imageUrl = res.url + imageUrl;
                }
                embed.imageUrll = PROXY_PREFIX + imageUrl;
                break;
            }

            case "theme-color": {
                embed.color = parseInt(tag.getAttribute("content").substr(1), 16);
                break;
            }
        }
    }

    if(!embed.title) {
        const t = parsedHtml.head.getElementsByTagName("title");
        if(t.length > 0) {
            embed.title = t.item(0).innerText;
        }
    }

    return embed;
}
