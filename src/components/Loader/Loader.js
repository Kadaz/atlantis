import React from "react";

import * as libraryActions from "../actions/libraryActions";

const Loader = ({ uri }) => {

```
React.useEffect(() => {

    if (!uri) {
        return;
    }

    let cancelled = false;

    const loadROM = async () => {

        try {

            const response = await fetch(uri, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(
                    `ROM download failed: HTTP ${response.status}`
                );
            }

            const buffer = await response.arrayBuffer();

            if (!buffer.byteLength) {
                throw new Error(`ROM file is empty.`);
            }

            if (!cancelled) {
                libraryActions.setCurrentROM(buffer);
            }

        } catch (error) {

            console.error(
                "Atlantis ROM loading error:",
                error
            );

        }

    };

    loadROM();

    return () => {
        cancelled = true;
    };

}, [uri]);

return null;
```

};

export default React.memo(
Loader,
(prevProps, nextProps) =>
prevProps.uri === nextProps.uri
);
