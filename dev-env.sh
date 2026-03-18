#!/bin/bash

# DatArt 开发环境管理脚本

set -e

DOCKER_COMPOSE_FILE="docker-compose.dev.yml"

show_help() {
    echo "DatArt 开发环境管理脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  up          启动开发环境"
    echo "  down        停止开发环境"
    echo "  restart     重启开发环境"
    echo "  logs        查看服务日志"
    echo "  logs-f      实时查看服务日志"
    echo "  build       重新构建服务"
    echo "  ps          查看服务状态"
    echo "  mysql       连接 MySQL 数据库"
    echo "  redis       连接 Redis 数据库"
    echo "  help        显示此帮助信息"
    echo ""
}

case "${1:-}" in
    up)
        echo "启动 DatArt 开发环境..."
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        echo "开发环境已启动！"
        echo "前端应用：http://localhost:3000"
        echo "后端 API：http://localhost:8080"
        echo "MySQL：localhost:3306"
        echo "Redis：localhost:6379"
        ;;
    down)
        echo "停止 DatArt 开发环境..."
        docker-compose -f $DOCKER_COMPOSE_FILE down
        echo "开发环境已停止！"
        ;;
    restart)
        echo "重启 DatArt 开发环境..."
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        echo "开发环境已重启！"
        ;;
    logs)
        echo "显示服务日志..."
        docker-compose -f $DOCKER_COMPOSE_FILE logs
        ;;
    "logs-f")
        echo "实时显示服务日志..."
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f
        ;;
    build)
        echo "重新构建服务..."
        docker-compose -f $DOCKER_COMPOSE_FILE build
        echo "服务构建完成！"
        ;;
    ps)
        echo "查看服务状态..."
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        ;;
    mysql)
        echo "连接到 MySQL 数据库..."
        docker exec -it datart-mysql-dev mysql -u datart -pdatart123 datart
        ;;
    redis)
        echo "连接到 Redis 数据库..."
        docker exec -it datart-redis-dev redis-cli
        ;;
    *)
        show_help
        ;;
esac