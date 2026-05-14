from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_healthcheck():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_content_endpoint_returns_portfolio_content():
    response = client.get("/content")
    assert response.status_code == 200
    data = response.json()
    assert data["profile"]["name"] == "Farid Stiven Prado Hoyos"
    assert isinstance(data["projects"], list)
    assert len(data["projects"]) >= 1
