const STATUS = {
  'LOADING': 0,
  'ERROR': 2,
  'FINISH': 1
};

const EVENT_NAMESPACE = 'AssetsManager:';

function preload (path) {
  let image = new Image();
  let p = new Promise(
    (resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
    }
  );

  image.src = path;
  return p;
}

export default class AssetsManager {
  constructor ({ assets, pubSub }) {
    this.pubSub = pubSub;
    this.assets = {};
    if (assets) {
      assets.forEach(asset => {
        this.addToQueue(asset.id, asset.path);
      });
    }
  }

  addToQueue (id, path) {
    if (this.assets[ id ]) {
      this.assets[ id ].attempt++;
      this.assets[ id ].status = STATUS.LOADING;
      path = path || this.assets[ id ].path;
    } else {
      this.assets[ id ] = {
        path,
        status: STATUS.LOADING,
        image: null,
        attempt: 0
      };
    }

    preload(path).then(image => {
      this.onAssetLoaded(id, image);
    }, error => {
      this.onError(id, error);
    });

    this.pubSub.publish(EVENT_NAMESPACE + 'loading', status);
  }

  getAsset (id) {
    if (!id || !this.assets[ id ]) {
      return null;
    }
    return this.assets[ id ].image;
  }

  onAssetLoaded (id, image) {
    this.assets[ id ].status = STATUS.FINISH;
    this.assets[ id ].image = image;
    this.checkProgress();
  }

  checkProgress () {
    let status = {
      loading: [],
      finished: [],
      error: []
    };

    for (let asset in this.assets) {
      switch (this.assets[ asset ].status) {
        case STATUS.LOADING:
          status.loading.push(asset);
          break;
        case STATUS.ERROR:
          status.error.push(asset);
          break;
        case STATUS.FINISH:
          status.finished.push(asset);
          break;
      }
    }

    this.pubSub.publish(EVENT_NAMESPACE + 'progress', status);

    if (
      status.loading.length === 0 &&
      status.finished.length > 0 &&
      status.error.length === 0
    ) {
      this.pubSub.publish(EVENT_NAMESPACE + 'ready', this.assets);
    }
  }

  onError (id, error) {
    this.assets[ id ].status = STATUS.ERROR;
    console.error(`Error getting asset ${id}`, error);
    if (this.assets[ id ].attempt < 3) {
      console.error(`Retrying getting asset ${id}`);
      setTimeout(() => {
        this.addToQueue(id);
      }, 500);
    } else {
      console.error(`Path of ${id} is corrupted, cannot download image, check config!`);
    }
  }

  on (event, handler, context) {
    event = EVENT_NAMESPACE + event;
    this.pubSub.subscribe(event, handler, context);
  }
}
