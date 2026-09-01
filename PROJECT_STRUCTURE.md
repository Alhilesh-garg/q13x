# Storefront Builder & Database Integration Architecture

## 🌐 Connected Backend API
- **Live Base URL**: `https://wxc1.onrender.com`
- **Frontend URL / Base Domain**: `https://q13x-three.vercel.app`
- **Subdomain Routing**: `https://[subdomain].q13x-three.vercel.app` (e.g. `https://luminastudio.q13x-three.vercel.app`)

---

## 📡 Complete API Endpoints & Contract

### 1. `POST /api/upload-image`
- **Purpose**: Uploads user image to ImgBB via backend proxy.
- **Frontend Optimization**: Image is pre-compressed to JPEG in browser canvas before uploading.
- **Request Body**:
  ```json
  { "image": "base64_string_without_data_url_prefix" }
  ```
- **Response**:
  ```json
  { "success": true, "imageUrl": "https://i.ibb.co/..." }
  ```

### 2. `GET /api/store/check-subdomain/:subdomain`
- **Purpose**: Real-time debounce check if the subdomain is available.
- **Response**:
  ```json
  { "success": true, "available": true }
  ```
  or
  ```json
  { "success": false, "available": false, "error": "Taken" }
  ```

### 3. `POST /api/store/create`
- **Purpose**: Creates and saves new store draft with a secret 6-digit PIN.
- **Request Body**:
  ```json
  {
    "subdomain": "meeraskitchen",
    "title": "Meera's Kitchen",
    "tagline": "Handcrafted culinary treats",
    "socials": ["https://wa.me/919876543210", "https://instagram.com/meeraskitchen"],
    "images": ["https://i.ibb.co/.../1.jpg"],
    "editPassword": "849201"
  }
  ```
- **Response**:
  ```json
  { "success": true, "storeUrl": "https://meeraskitchen.q13x-three.vercel.app" }
  ```

### 4. `POST /api/store/unlock-for-edit`
- **Purpose**: Unlocks store for editing using subdomain and 6-digit PIN.
- **Request Body**:
  ```json
  {
    "subdomain": "meeraskitchen",
    "editPassword": "849201"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "store": {
      "subdomain": "meeraskitchen",
      "title": "Meera's Kitchen",
      "tagline": "Handcrafted culinary treats",
      "socials": [...],
      "images": [...]
    }
  }
  ```

### 5. `PUT /api/store/update`
- **Purpose**: Updates existing store in database with 6-digit PIN verification.
- **Request Body**:
  ```json
  {
    "subdomain": "meeraskitchen",
    "editPassword": "849201",
    "title": "Meera's Kitchen & Bakery",
    "tagline": "Updated tagline",
    "socials": [...],
    "images": [...]
  }
  ```
- **Response**:
  ```json
  { "success": true, "message": "Updated successfully" }
  ```

### 6. `GET /api/store/public/:subdomain`
- **Purpose**: Fetches public storefront data for normal visitors (`?store=subdomain`).
- **Response**:
  ```json
  {
    "success": true,
    "store": {
      "subdomain": "meeraskitchen",
      "title": "Meera's Kitchen",
      "tagline": "...",
      "socials": [...],
      "images": [...]
    }
  }
  ```
