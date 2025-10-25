const Joi = require('joi');

const schemas = {
  createTask: Joi.object({
    project_id: Joi.string().uuid().required(),
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(5000).allow('', null),
    status: Joi.string().valid('todo', 'in_progress', 'review', 'done', 'archived'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    assigned_to: Joi.string().uuid().allow(null),
    due_date: Joi.date().iso().allow(null),
    estimated_hours: Joi.number().min(0).max(999).allow(null),
    tags: Joi.array().items(Joi.string().max(50))
  }),

  updateTask: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(5000).allow('', null),
    status: Joi.string().valid('todo', 'in_progress', 'review', 'done', 'archived'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    assigned_to: Joi.string().uuid().allow(null),
    due_date: Joi.date().iso().allow(null),
    estimated_hours: Joi.number().min(0).max(999).allow(null),
    actual_hours: Joi.number().min(0).max(999).allow(null),
    tags: Joi.array().items(Joi.string().max(50))
  }),

  addComment: Joi.object({
    comment: Joi.string().min(1).max(2000).required()
  }),

  updateComment: Joi.object({
    comment: Joi.string().min(1).max(2000).required()
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

