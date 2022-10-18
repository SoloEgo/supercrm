import http from "../http-common";
class ContractorDataService {
    getAll() {
        return http.get("/contractors");
    }
    findOne(id) {
        return http.get(`/contractors/${id}`);
    }
    create(data) {
        return http.post("/contractors", data);
    }
    update(id, data) {
        return http.put(`/contractors/${id}`, data);
    }
    delete(id) {
        return http.delete(`/contractors/${id}`);
    }
    deleteAll() {
        return http.delete(`/contractors`);
    }
}
export default new ContractorDataService();