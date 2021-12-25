<div id="pnl_list">
	<div class="fgta-page-title">Daftar <!--__PAGETITLE__--></div>

	<div id="pnl_list-pnl_head" style="display: flex; align-items: flex-end">
		<div class="list-buttonbaru" style="text-align: right; width: calc(100% - 10px); float: right;  position: absolute">
			<a href="javascript:void(0)" id="pnl_list-btn_new" class="easyui-linkbutton c8" style="width: 60px">Baru</a>
		</div>
		<?php
		$customsearch = __DIR__.'/<!--__CUSTOMSEARCHINC__-->'; 
		if (is_file($customsearch)) {
			include $customsearch;
		} else { ?>
		<!-- Simple Query -->
		<div class="list-search-wrap" style="width: calc(100% - 65px); display: flex;">
			<div class="list-search-item" style="width: 50px;">Cari</div>
			<div class="list-search-item">
				<input id="pnl_list-txt_search" class="easyui-textbox" style="width: 100%">
			</div>
			<div class="list-search-item" style="width: 45px">
				<a href="javascript:void(0)" id="pnl_list-btn_load" class="easyui-linkbutton c8" style="width: 45px">Load</a>
			</div>
		</div>
		<?php } ?>
	</div>


	<div style="margin-top: 10px">
		<table id="pnl_list-tbl_list" paging="true" cellspacing="0" width="100%" class="deftable">
			<thead>
				<?php
				$customview = __DIR__.'/<!--__CUSTOMVIEWINC__-->'; 
				if (is_file($customview)) {
					include $customview;
				} else { ?>
				<tr>
<!--__HEADERMAP__-->
				</tr>
				<tr style="background-color: #cccccc; height: 30px">
<!--__HEADERROW__-->
				</tr>
				<?php } ?>
			</thead>
		</table>
	</div>



</div>