const Joi = require('joi');

const schemas = {
  createProject: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(1000).allow('', null),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'archived'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    start_date: Joi.date().iso().allow(null),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).allow(null),
    budget: Joi.number().min(0).allow(null),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).allow(null)
  }),

  updateProject: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(1000).allow('', null),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'archived'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    start_date: Joi.date().iso().allow(null),
    end_date: Joi.date().iso().allow(null),
    budget: Joi.number().min(0).allow(null),
    progress: Joi.number().min(0).max(100),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).allow(null)
  }),

  addMember: Joi.object({
    user_id: Joi.string().uuid().required(),
    role: Joi.string().valid('admin', 'member', 'viewer').default('member')
  }),

  updateMemberRole: Joi.object({
    role: Joi.string().valid('admin', 'member', 'viewer').required()
  })
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({ error: 'Validation schema not found' });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = { validate };

