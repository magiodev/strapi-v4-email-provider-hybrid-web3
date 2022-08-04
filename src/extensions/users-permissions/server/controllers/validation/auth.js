'use strict';

const {yup, validateYupSchema} = require('@strapi/utils');

const callbackBodySchema = yup.object().shape({
  //identifier: yup.string().required(),
  //password: yup.string().required(),
  message: yup.string().required(),
  signature: yup.string().required(),
  signer: yup.string().min(42).max(42).required(), // TODO more validation, 0x0 format with toCheckSumAddressFormat from web3.utils
});

const registerBodySchema = yup.object().shape({
  /*email: yup
    .string()
    .email(),
  username: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),*/
  message: yup.string().required(),
  signature: yup.string().required(),
  signer: yup.string().min(42).max(42).required(), // TODO more validation, 0x0 format with toCheckSumAddressFormat from web3.utils
});

const sendEmailConfirmationBodySchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
});

module.exports = {
  validateCallbackBody: validateYupSchema(callbackBodySchema),
  validateRegisterBody: validateYupSchema(registerBodySchema),
  validateSendEmailConfirmationBody: validateYupSchema(sendEmailConfirmationBodySchema),
};
