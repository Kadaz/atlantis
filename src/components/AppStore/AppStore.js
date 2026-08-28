import React from "react";

import {
List,
ListItem,
ListItemIcon,
ListItemText,
Drawer,
ListSubheader
} from "@material-ui/core";

import Box from "@material-ui/core/Box";
import { Storage as StorageIcon } from "@material-ui/icons";

import { appContext } from "../Context/Context";
import * as appActions from "../actions/appActions";

import { useLibraryStyles } from "../Library/LibraryStyles";
import GameList from "../Library/GameList";
import Game from "../Library/Game";
import Loader from "../Loader/Loader";

const RETRO_MEDIA_API =
`https://api.github.com/repos/Kadaz/Retro-Media/git/trees/main?recursive=1`;

const RETRO_MEDIA_RAW =
`https://raw.githubusercontent.com/Kadaz/Retro-Media/main/`;

const AppStore = () => {
const state = React.useContext(appContext);
const classes = useLibraryStyles();

const [roms, setRoms] = React.useState([]);
const [selectedGame, setSelectedGame] = React.useState(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState(null);

const loadROM = uri => () => {
setSelectedGame(uri);
};

const fetchROMs = async () => {
setLoading(true);
setError(null);

```
try {
  const response = await fetch(
    RETRO_MEDIA_API,
    {
      cache: `no-store`
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status}`
    );
  }

  const data = await response.json();

  const foundROMs = data.tree
    .filter(item => {
      return (
        item.type === `blob` &&
        /^roms\/.*\.(gb|gbc)$/iu.test(item.path)
      );
    })
    .sort((a, b) =>
      a.path.localeCompare(b.path)
    )
    .map(item => {
      const filename = item.path
        .split(`/`)
        .pop();

      return {
        path: item.path,
        title: filename.replace(
          /\.(gb|gbc)$/iu,
          ``
        ),
        uri:
          RETRO_MEDIA_RAW +
          item.path
            .split(`/`)
            .map(encodeURIComponent)
            .join(`/`)
      };
    });

  setRoms(foundROMs);

} catch (fetchError) {
  console.error(
    `Could not load Retro-Media ROM list:`,
    fetchError
  );

  setError(
    `Could not load ROMs from Retro-Media.`
  );
}

setLoading(false);
```

};

React.useEffect(() => {
if (state.appStoreOpen) {
fetchROMs();
}
}, [state.appStoreOpen]);

return (
<>
<ListItem
button
onClick={appActions.toggleDrawer(`appStore`)}
> <ListItemIcon> <StorageIcon /> </ListItemIcon>

```
    <ListItemText>
      {`Retro-Media ROMs`}
    </ListItemText>
  </ListItem>

  <Drawer
    anchor="right"
    open={state.appStoreOpen}
    onClose={appActions.toggleDrawer(`appStore`)}
  >
    <Box clone p="0">
      <List
        className={classes.drawer}
        role="button"
        subheader={
          <ListSubheader
            className={classes.heading}
          >
            <StorageIcon
              className={classes.headingIcon}
            />

            {`Retro-Media`}
          </ListSubheader>
        }
      >

        {loading && (
          <ListItem>
            <ListItemText>
              {`Searching for GB/GBC ROMs...`}
            </ListItemText>
          </ListItem>
        )}

        {error && (
          <ListItem>
            <ListItemText>
              {error}
            </ListItemText>
          </ListItem>
        )}

        {!loading &&
          !error &&
          roms.length === 0 && (
            <ListItem>
              <ListItemText>
                {`No GB/GBC ROMs found.`}
              </ListItemText>
            </ListItem>
          )}

        {!loading &&
          !error &&
          roms.length > 0 && (
            <GameList>
              {roms.map(rom => (
                <Game
                  key={rom.path}
                  setCurrentROM={loadROM(
                    rom.uri
                  )}
                  thumb={false}
                  title={rom.title}
                  developer={
                    /\.gbc$/iu.test(rom.path)
                      ? `Game Boy Color`
                      : `Game Boy`
                  }
                />
              ))}
            </GameList>
          )}

        <Loader uri={selectedGame} />

      </List>
    </Box>
  </Drawer>
</>
```

);
};

export default AppStore;
