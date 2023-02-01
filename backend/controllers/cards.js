const Card = require("../models/card");
const {
  WRONG_CARD_ID,
  CARD_DOES_NOT_EXIST,
  VALIDATION_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
} = require("../utils/constatnts");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");
const ForbiddenError = require("../errors/forbiddenError");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const user = req.user._id;
  Card.create({ name, link, owner: user })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(CARD_DOES_NOT_EXIST);
      }
      const owner = card.owner.toString();
      if (owner !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN_ERROR_MESSAGE);
      }
      card.deleteOne({ _id: card._id });
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError(VALIDATION_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

const cardLikeToggler = (req, res, next, action) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    action,
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(CARD_DOES_NOT_EXIST);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError(WRONG_CARD_ID));
        return;
      }
      next(err);
    });
};

const handleCardLike = (req, res, next) => {
  cardLikeToggler(req, res, next, { $addToSet: { likes: req.user._id } });
};

const handleCardDislike = (req, res, next) => {
  cardLikeToggler(req, res, next, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  handleCardLike,
  handleCardDislike,
};
