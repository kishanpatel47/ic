// https://stackoverflow.com/questions/44719103/singleton-object-in-react-native
export default class CommonDataManager {
  static myInstance = null;
  arrTypes = [];
  arrMaterial = [];
  arrCollection = [];
  arrGallery = [];
  _userID = '';

  /**
   * @returns {CommonDataManager}
   */
  static getInstance() {
    if (CommonDataManager.myInstance == null) {
      console.warn('Create new instance');
      CommonDataManager.myInstance = new CommonDataManager();
    }

    return this.myInstance;
  }

  // Types -------------------------------------------
  getTypesArray() {
    return this.arrTypes;
  }
  setTypesArray(value) {
    this.arrTypes = value;
  }
  // Types -------------------------------------------

  // Material -------------------------------------------
  getMaterialArray() {
    return this.arrMaterial;
  }
  setMaterialArray(value) {
    this.arrMaterial = value;
  }
  // Material -------------------------------------------

  // Collection -------------------------------------------
  getCollectionArray() {
    return this.arrCollection;
  }
  setCollectionArray(value) {
    this.arrCollection = value;
  }
  // Collection -------------------------------------------

  //Gallery List -------------------------------------------
  getGalleryArray() {
    return this.arrGallery;
  }
  setGalleryArray(value) {
    this.arrGallery = value;
  }

  getUserID() {
    return this._userID;
  }

  setUserID(id) {
    this._userID = id;
  }
}
