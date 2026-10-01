import { VERSION } from '@configs/config'

const caching = () => {

    let version = localStorage.getItem("version");
    if (version !== VERSION) {
      if ("caches" in window) {
        caches.keys().then((names) => {
          // Delete all the cache files
          names.forEach((name) => {
            caches.delete(name);
          });
        });

        // Makes sure the page reloads. Changes are only visible after you refresh.
        window.location.reload(true);
      }

      localStorage.removeItem("version");
      localStorage.setItem("version", VERSION);
    }
  };

  export default caching;
