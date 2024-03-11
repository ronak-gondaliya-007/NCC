import Joi from 'joi';

export const addPersonalDetail = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile:Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  country: Joi.string().required(),
  countryISO: Joi.string().required(),
  province: Joi.string().required(),
  provinceISO: Joi.string().required(),
  city: Joi.string().required()
});

const socialMediaLinks = Joi.object({
  twitter: Joi.string().uri().default('').allow(''),
  linkedin: Joi.string().uri().default('').allow(''),
  instagram: Joi.string().uri().default('').allow(''),
  youtube: Joi.string().uri().default('').allow(''),
});


export const addBusinessDetail = Joi.object({
  businessName: Joi.string().required(),
  category: Joi.array().items(Joi.string()).min(1).max(3).required(),
  vendorType: Joi.array().items(Joi.string()).min(1).required(),
  aboutBusiness: Joi.string().max(100).allow(''),
  socialMediaLinks: socialMediaLinks
});

export const updateSocialMediaLinks = Joi.object({
  socialMediaLinks: socialMediaLinks
});