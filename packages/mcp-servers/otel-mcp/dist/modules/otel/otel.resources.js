var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ResourceDecorator as Resource } from '@nitrostack/core';
export class OTelResources {
    otelService;
    constructor(otelService) {
        this.otelService = otelService;
    }
    async getTraceWaterfall(uri, params) {
        return { contents: [{ uri, text: await this.otelService.fetchTraceWaterfall(params.trace_id) }] };
    }
}
__decorate([
    Resource({
        name: 'trace_waterfall',
        uri: 'otel://traces/{trace_id}/waterfall',
        description: 'Structural JSON representation of the entire microservice call hierarchy'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OTelResources.prototype, "getTraceWaterfall", null);
//# sourceMappingURL=otel.resources.js.map