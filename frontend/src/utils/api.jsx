class Api {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
  }

  async _useFetch(link, newMethod = "GET", newBody) {
    const res = await fetch(`${this._url}${link}`, {
      method: newMethod,
      headers: this._headers,
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
  url: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem('token')}`
  },
});

export default api;
