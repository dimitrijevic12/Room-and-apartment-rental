function toast(sMessage) {
	var container = $(document.createElement("div"));
	container.addClass("toast");

	var message = $(document.createElement("div"));
	message.addClass("message");
	message.text(sMessage);
	message.appendTo(container);

	container.appendTo(document.body);

	container.delay(100).fadeIn("slow", function() {
		$(this).delay(2000).fadeOut("slow", function() {
			$(this).remove();
		});
	});
}