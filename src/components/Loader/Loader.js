import React from "react";
import PropTypes from "prop-types";

import * as libraryActions from "../actions/libraryActions";

const Loader = ({ uri }) => {
React.useEffect(() => {
(async () => {
if (!uri) {
return;
}

```
  try {
    const response = await fetch(uri, {
      cache: `no-store`
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status}`
      );
    }

    const buffer = await response.arrayBuffer();

    if (!buffer.byteLength) {
      throw new Error(`ROM file is empty.`);
    }

    libraryActions.setCurrentROM(buffer);
  } catch (error) {
    console.error(
      `There has been a problem loading the ROM:`,
      error
    );
  }
})();
```

}, [uri]);

return null;
};

Loader.propTypes = {
uri: PropTypes.string
};

export default React.memo(
Loader,
(prevProps, nextProps) => prevProps.uri === nextProps.uri
);
