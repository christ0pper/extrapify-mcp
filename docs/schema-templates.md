# Extrapify Schema Templates

These templates are intended for `extract_structured_data`.

## Article

```json
{
  "title": "string",
  "summary": "string",
  "author": "string",
  "published_at": "date",
  "section": "string",
  "canonical_url": "url",
  "tags": "string[]"
}
```

## Product

```json
{
  "name": "string",
  "brand": "string",
  "price": "number",
  "currency": "string",
  "availability": "string",
  "rating": "float",
  "review_count": "integer",
  "image_url": "url"
}
```

## Job listing

```json
{
  "title": "string",
  "company": "string",
  "location": "string",
  "employment_type": "string",
  "salary_range": "string",
  "posted_at": "date",
  "apply_url": "url"
}
```

## Company profile

```json
{
  "company_name": "string",
  "description": "string",
  "headquarters": "string",
  "website": "url",
  "pricing_page": "url",
  "product_categories": "string[]"
}
```
