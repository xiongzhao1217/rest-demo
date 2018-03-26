
$(document).ready(function(){
	
	$(document).on('click','#selectCover',function(){
		$("#imgPreview").attr('src' ,$(this).attr("data-url"));
		$("#imgFilePath").val($(this).attr("data-url"));
		$("#imgPreview").show();
	});
	
});
