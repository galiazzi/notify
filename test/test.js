describe("Notify", function () {

    it("Métodos gerais", function () {
        expect(typeof Notify.error === "function").to.be.true;
        expect(typeof Notify.info === "function").to.be.true;
        expect(typeof Notify.warning === "function").to.be.true;
        expect(typeof Notify.success === "function").to.be.true;
        expect(typeof Notify.config === "function").to.be.true;
        expect(typeof Notify.createPMessage === "function").to.be.true;
    });

});
