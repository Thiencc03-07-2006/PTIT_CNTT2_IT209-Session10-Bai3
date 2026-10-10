# Bài 3: Tối ưu Docker Image với Multi-stage Build

## 1. Mục tiêu

- So sánh Docker image build thông thường và Multi-stage Build.
- Tận dụng Layer Cache khi cài đặt dependencies.
- Giảm dung lượng image production.
- Kiểm tra API sau khi build.

## 2. Công nghệ

- Docker
- Node.js 18
- Express.js
- Docker Layer Caching
- Multi-stage Build

## 3. Cấu trúc dự án

- `server.js`: mã nguồn backend.
- `package.json`: khai báo dependencies.
- `Dockerfile.single`: Dockerfile build thông thường.
- `Dockerfile`: Dockerfile Multi-stage Build.
- `.dockerignore`: loại trừ tệp không cần thiết.
- `README.md`: hướng dẫn và kết quả so sánh.

## 4. Build image

### Single-stage

```bash
docker build -f Dockerfile.single -t hw-backend:single .
```

### Multi-stage

```bash
docker build -f Dockerfile -t hw-backend:multistage .
```

## 5. Bảng so sánh

| Tiêu chí             | Single-stage          | Multi-stage                           |
| -------------------- | --------------------- | ------------------------------------- |
| Image tag            | `hw-backend:single`   | `hw-backend:multistage`               |
| Base image           | `node:18`             | `node:18-alpine`                      |
| Build stages         | 1                     | 2                                     |
| Cài đặt dependency   | `npm install`         | `npm install --omit=dev`              |
| Mã nguồn trong image | Có                    | Chỉ sao chép tệp runtime cần thiết    |
| Dung lượng image     | 1.12 GB               | 85.4 MB                               |
| Số lượng Layer       | 12 layers             | 6 layers                              |
| API hoạt động        | Hoạt động bình thường | Hoạt động ổn định, phản hồi chính xác |

## 6. Kiểm tra

```bash
docker images hw-backend
docker image inspect hw-backend:single --format '{{len .RootFS.Layers}}'
docker image inspect hw-backend:multistage --format '{{len .RootFS.Layers}}'
docker history hw-backend:single
docker history hw-backend:multistage
```

Kiểm tra API:

```bash
docker run -d --name backend-multistage -p 3002:3000 hw-backend:multistage
```

```bash
curl http://localhost:3002/api/health
```

Kết quả mong đợi:

```json
{
  "status": "UP"
}
```

## 7. Kết luận

Multi-stage Build cho phép tách giai đoạn chuẩn bị và giai đoạn runtime, giảm các thành phần không cần thiết trong image cuối cùng. Việc sao chép file khai báo dependencies trước khi sao chép toàn bộ mã nguồn cũng giúp tận dụng Docker Layer Cache khi mã nguồn thay đổi nhưng dependencies không đổi.

Dung lượng và số lượng Layer cần được cập nhật từ kết quả thực tế trên máy thực hành.
