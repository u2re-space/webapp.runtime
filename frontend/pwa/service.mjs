// Config
const NETWORK_TIMEOUT_MS = 6000; // hosting, amvera
//const NETWORK_TIMEOUT_MS = 3000; //localhost, router
const RUNTIME = "webapp";

//
const isSameOrigin = (urlString) => {
    const urlOrigin = new URL(urlString).origin;
    return urlOrigin.startsWith(self.location.origin);
};

//
const _WARN_ = (...args) => {
    const real = args.filter((v) => v != null);
    if (real && real.length > 0)
        { console.warn(...real); };
    return null;
};

//
const tryFetch = (req, event) => {
    const sendResponse = async (response) => {
        const resp = Promise?.try?.(async ()=>{
            const clone = await (await response)?.clone?.();
            return (clone || response);
        });
        Promise?.try?.(async ()=>{
            const rc = (await resp) || (await response);
            if (rc && (rc?.ok || rc?.status == 200)) {
                const cache = await caches.open(RUNTIME)?.catch?.(console.warn.bind(console));
                await cache?.add?.(rc)?.catch?.(console.warn.bind(console));
                return rc;
            }
        })?.catch?.(console.warn.bind(console));
        return response;
    };

    //
    {
        // @ts-ignore
        const ctime = !navigator.onLine || (navigator?.connection?.effectiveType == "slow-2g") ? 1000 : NETWORK_TIMEOUT_MS;
        const fc = new Promise((resolve, reject) =>setTimeout(() => reject(null), ctime)).catch(_WARN_);
        const fp = fetch(req, {
            cache: "no-store",
            signal: AbortSignal.timeout(ctime + 2000),
            mode: (req?.url ?? req).startsWith("http:") ? "no-cors" : (isSameOrigin(req?.url ?? req) ? "same-origin" : "cors"),
        }).then(sendResponse).catch(_WARN_);

        //
        return Promise.race([fp, fc]).catch((_) => null);
    }
};

//
const fit = (req, event) => {

    //
    const tryLoad = async ()=>{
        for (let i = 0; i < 3; i++) {
            try {
                const resp = await tryFetch(req, event);
                if (await resp) { return resp; }
            } catch (e) {
                console.warn(e);
            }
            console.warn("Attempt: " + i + ", failed, trying again...");
        }
        return null;
    };

    //
    const cached = caches.open(RUNTIME).then((c) => c?.match?.(req, {
        ignoreSearch: true,
        ignoreMethod: true,
        ignoreVary: true,
    })).catch(()=>null);

    //
    event?.waitUntil?.(cached);

    //
    const useCached = (!navigator.onLine || (navigator?.connection?.effectiveType == "slow-2g"));
    const anyone = (useCached ? cached : Promise.try(tryLoad))?.then?.((r)=>(r||cached))?.catch(()=>cached);
    anyone?.then?.(()=>self.skipWaiting());
    anyone?.then?.(console.log.bind(console));
    return anyone;
};

//
const putCacheAll = (list) => {
    return Promise.allSettled(
        list.map(async (it) => {
            const cache = await caches.open(RUNTIME);
            return cache.add(it);
        })
    ).catch(_WARN_);
};

//
const preloadNeeded = (list) => {
    const cache = putCacheAll(list);
    cache.then(()=>self.skipWaiting());
    return cache;
};

//
const PRE_CACHE_FORCE = [].map((u) => new URL(u, self.location.origin).href);

//
self?.addEventListener?.("install", (event) => {
    event.waitUntil(preloadNeeded([...PRE_CACHE_FORCE]));
    self.skipWaiting();
});

//
self?.addEventListener?.('activate', (event) => {
    const claims = self.clients.claim();
    claims.then(()=>self.skipWaiting())
    event.waitUntil(claims);
});

//
self?.addEventListener?.('fetch', (event) => {
    event.respondWith(fit(event.request, event));
});
