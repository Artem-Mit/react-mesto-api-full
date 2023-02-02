class Api {
  constructor(options) {
    this._url = options.url;
  }

  async _useFetch(link, newMethod = "GET", newBody) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${this._url}${link}`, {
      method: newMethod,
      headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`},
      body: JSON.stringify(newBody),
    });
    return this._checkResult(res);
  }

  _checkResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getProfileInfo() {
    return this._useFetch("/users/me");
  }

  getInitialCards() {
    return this._useFetch("/cards");
  }

  editProfileInfo(data) {
    return this._useFetch("/users/me", "PATCH", data);
  }

  postNewCard(data) {
    return this._useFetch("/cards", "POST", data);
  }

  deleteCard(id) {
    return this._useFetch(`/cards/${id}`, "DELETE");
  }

  setAvatar(data) {
    return this._useFetch(`/users/me/avatar`, "PATCH", data);
  }

  changeLikeCardStatus(id, isLiked) {
    return this._useFetch(`/cards/${id}/likes`, isLiked ? "PUT" : "DELETE");
  }
}

const api = new Api({
  url: process.env.REACT_APP_API_SRV,
});

export default api;
