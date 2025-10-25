const { gql } = require('graphql-tag');

const typeDefs = gql`
  # Scalars
  scalar DateTime
  scalar JSON

  # Enums
  enum UserRole {
    admin
    manager
    member
  }

  enum ProjectStatus {
    planning
    active
    on_hold
    completed
    archived
  }

  enum ProjectMemberRole {
    owner
    admin
    member
    viewer
  }

  enum TaskStatus {
    todo
    in_progress
    review
    done
    archived
  }

  enum Priority {
    low
    medium
    high
    critical
  }

  enum NotificationType {
    task_assigned
    task_updated
    task_completed
    comment_added
    project_invite
    project_updated
    mention
    system
  }

  # Types
  type User {
    id: ID!
    email: String!
    first_name: String!
    last_name: String!
    role: UserRole!
    avatar_url: String
    is_active: Boolean!
    email_verified: Boolean!
    last_login: DateTime
    created_at: DateTime!
    updated_at: DateTime!
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type Project {
    id: ID!
    name: String!
    description: String
    owner_id: ID!
    status: ProjectStatus!
    priority: Priority!
    start_date: DateTime
    end_date: DateTime
    budget: Float
    progress: Int!
    color: String!
    created_at: DateTime!
    updated_at: DateTime!
    members: [ProjectMember!]!
    tasks: [Task!]
  }

  type ProjectMember {
    id: ID!
    project_id: ID!
    user_id: ID!
    role: ProjectMemberRole!
    joined_at: DateTime!
    user: User
  }

  type Task {
    id: ID!
    project_id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: Priority!
    assigned_to: ID
    created_by: ID!
    due_date: DateTime
    estimated_hours: Float
    actual_hours: Float
    tags: [String!]!
    order_index: Int!
    created_at: DateTime!
    updated_at: DateTime!
    comments: [TaskComment!]!
    assignee: User
    creator: User
  }

  type TaskComment {
    id: ID!
    task_id: ID!
    user_id: ID!
    comment: String!
    is_edited: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    user: User
  }

  type Notification {
    id: ID!
    user_id: ID!
    type: NotificationType!
    title: String!
    message: String!
    data: JSON
    is_read: Boolean!
    read_at: DateTime
    link: String
    priority: Priority!
    created_at: DateTime!
  }

  type NotificationPreference {
    id: ID!
    user_id: ID!
    email_enabled: Boolean!
    push_enabled: Boolean!
    task_assigned: Boolean!
    task_updated: Boolean!
    task_completed: Boolean!
    comment_added: Boolean!
    project_invite: Boolean!
    project_updated: Boolean!
    mention: Boolean!
  }

  type ProjectStats {
    total: Int!
    todo: Int!
    in_progress: Int!
    review: Int!
    done: Int!
    by_priority: PriorityStats!
  }

  type PriorityStats {
    low: Int!
    medium: Int!
    high: Int!
    critical: Int!
  }

  type PaginationInfo {
    total: Int!
    page: Int!
    limit: Int!
    pages: Int!
  }

  type ProjectList {
    projects: [Project!]!
    pagination: PaginationInfo!
  }

  type TaskList {
    tasks: [Task!]!
    pagination: PaginationInfo!
  }

  type NotificationList {
    notifications: [Notification!]!
    unreadCount: Int!
    pagination: PaginationInfo!
  }

  # Inputs
  input RegisterInput {
    email: String!
    password: String!
    first_name: String!
    last_name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    first_name: String
    last_name: String
    avatar_url: String
  }

  input CreateProjectInput {
    name: String!
    description: String
    status: ProjectStatus
    priority: Priority
    start_date: DateTime
    end_date: DateTime
    budget: Float
    color: String
  }

  input UpdateProjectInput {
    name: String
    description: String
    status: ProjectStatus
    priority: Priority
    start_date: DateTime
    end_date: DateTime
    budget: Float
    progress: Int
    color: String
  }

  input CreateTaskInput {
    project_id: ID!
    title: String!
    description: String
    status: TaskStatus
    priority: Priority
    assigned_to: ID
    due_date: DateTime
    estimated_hours: Float
    tags: [String!]
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: Priority
    assigned_to: ID
    due_date: DateTime
    estimated_hours: Float
    actual_hours: Float
    tags: [String!]
  }

  input UpdateNotificationPreferencesInput {
    email_enabled: Boolean
    push_enabled: Boolean
    task_assigned: Boolean
    task_updated: Boolean
    task_completed: Boolean
    comment_added: Boolean
    project_invite: Boolean
    project_updated: Boolean
    mention: Boolean
  }

  # Queries
  type Query {
    # User queries
    me: User
    user(id: ID!): User

    # Project queries
    projects(status: ProjectStatus, search: String, page: Int, limit: Int): ProjectList!
    project(id: ID!): Project

    # Task queries
    tasks(project_id: ID, status: TaskStatus, priority: Priority, assigned_to: ID, search: String, page: Int, limit: Int): TaskList!
    task(id: ID!): Task
    projectStats(project_id: ID!): ProjectStats!

    # Notification queries
    notifications(unread_only: Boolean, page: Int, limit: Int): NotificationList!
    notificationPreferences: NotificationPreference!
  }

  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout(refreshToken: String): Boolean!

    # User mutations
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(current_password: String!, new_password: String!): Boolean!

    # Project mutations
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    addProjectMember(project_id: ID!, user_id: ID!, role: ProjectMemberRole): ProjectMember!
    removeProjectMember(project_id: ID!, member_id: ID!): Boolean!
    updateMemberRole(project_id: ID!, member_id: ID!, role: ProjectMemberRole!): ProjectMember!

    # Task mutations
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    addTaskComment(task_id: ID!, comment: String!): TaskComment!
    updateTaskComment(task_id: ID!, comment_id: ID!, comment: String!): TaskComment!
    deleteTaskComment(task_id: ID!, comment_id: ID!): Boolean!

    # Notification mutations
    markNotificationAsRead(id: ID!): Boolean!
    markAllNotificationsAsRead: Boolean!
    deleteNotification(id: ID!): Boolean!
    updateNotificationPreferences(input: UpdateNotificationPreferencesInput!): NotificationPreference!
  }
`;

module.exports = typeDefs;

