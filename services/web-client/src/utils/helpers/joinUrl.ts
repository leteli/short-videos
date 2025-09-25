export const joinUrl = (url: string, path: string, query: {[key: string | number]: string | number} = {}) => {
    const u = new URL(path, url);
    Object.keys(query).forEach(key => u.searchParams.append(key, String(query[key])));
    return u.href;
}
