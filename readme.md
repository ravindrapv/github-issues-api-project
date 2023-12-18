# GitHub Issues Sync API

This API allows you to synchronize GitHub issues with a local database and perform operations on those issues.

## Table of Contents

- [Sync GitHub Issues](#sync-github-issues)
- [Get Issue by ID](#get-issue-by-id)
- [Update Issue](#update-issue)
- [Get Paginated Issues](#get-paginated-issues)

## Sync GitHub Issues

**Endpoint:** `POST /api/issues/sync`

This endpoint synchronizes GitHub issues from a specified repository with the local database.

### Request


`POST /api/issues/sync`

```
{
  "success": true,
  "message": "Sync completed successfully"
}
```


Certainly! Below is an example README file in Markdown format describing the available endpoints in your application. Please customize it based on your actual endpoints, features, and any additional details you want to include:

markdown
Copy code

# GitHub Issues Sync API

This API allows you to synchronize GitHub issues with a local database and perform operations on those issues.

## Table of Contents

- [Sync GitHub Issues](#sync-github-issues)
- [Get Issue by ID](#get-issue-by-id)
- [Update Issue](#update-issue)
- [Get Paginated Issues](#get-paginated-issues)

## Sync GitHub Issues

**Endpoint:** `POST /api/issues/sync`

This endpoint synchronizes GitHub issues from a specified repository with the local database.

### Request

`POST /api/issues/sync`

### Get Issue by ID
**Endpoint:** `GET /api/issues/:issue_id`

This endpoint retrieves details of a specific GitHub issue by its ID from the local database.

`GET /api/issues/123`

### Update Issue ###
**Endpoint:** `PUT /api/issues/:issue_id`

This endpoint updates the details of a specific GitHub issue by its ID in both the local database and GitHub.


`PUT /api/issues/123`

Get Paginated Issues
*** Endpoint: *** `GET /api/issues`

This endpoint retrieves a paginated list of GitHub issues from the local database.


`GET /api/issues?page=1&pageSize=10`
