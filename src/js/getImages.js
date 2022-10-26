const axios = require('axios').default;

export async function getImages(keyWord, nrPage) {
   try {
      const response = await axios.get(
         `https://pixabay.com/api/?key=30856606-19b329139abde22b1a8069758=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true&page=${nrPage}&per_page=40`
      );
      return response;
   } catch (error) {
      console.error(error);
   }
}