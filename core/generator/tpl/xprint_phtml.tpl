<?php

	$doc_iso_reg = "<yout form iso number>";
	$report_title['id'] = "JUDUL FORM";
	$report_title['en'] = "FORM TITLE";

	$report_printid = strtoupper(uniqid());
	$report_printdate = date('d/m/Y');

	$doc_id = $this->{__PRIMARYID__};
	$doc_descr = 'change this descriptions from data';
?>



<div style="position: absolute; z-index: 1">
	<div  id="pagemeasure">&nbsp;</div>
</div>


<div id="wrapper" style="z-index: 10">

	<!-- page header: selalu ditampilkan pada tiap halaman, kecuali halaman 1 -->
	<div id="pageheader" class="fullwidth">
		<div>
			<div><?=$doc_id?></div>
			<div style="font-style: italic"><?=$doc_descr?></div>
		</div>
		<div style="text-align: right; width: 70mm;">
			<div style="display:inline-block; width: 38mm;"><b>Print Id</b> <?=$report_printid?></div>
			<div style="display:inline-block; width: 30mm;">&nbsp;</div>
			
		</div>
	</div>


	<!-- report header --->
	<div id="reporttitle" class="fullwidth">
		<div style="display: flex; justify-content: space-between">
			<div>
				<img id="ellogo" src="index.php/public/assets/logo-printform.svg">
			</div>
			<div style="text-align: right">
				<div style="font-size: 7pt; font-style: italic"><?=$doc_iso_reg?></div>
				<div style="font-weight: bold; font-size: 12pt; margin-top: 2mm"><?=$report_title['id']?></div>
				<div style="font-weight: bold; font-style: italic; font-size: 10pt; color: #666"><?=$report_title['en']?></div>
			</div>	
		</div>
	</div>

	<div class="fullwidth" style="position: relative; margin-top: 2mm; display: flex; justify-content: space-between; background-color: #fff">
		<div id="reporthead-col-dochead-1" style="flex: 1; margin-right: 1mm">
			<table width="100%" cellpadding="0" cellspacing="0">
				<!--
				<tr>
					<td class="rhead-tcol-label-1">label 1</td>
					<td class="rhead-tcol-value-1">value 1</td>
					<td class="rhead-tcol-label-2">label 2</td>
					<td class="rhead-tcol-value-2">value 2</td>
				</tr>
				-->
				<tr>
					<td class="rhead-tcol-label-1">ID</td>
					<td class="rhead-tcol-value-1"><?=$doc_id?></td>
					<td class="rhead-tcol-value-2" style="vertical-align: top; padding: 0px; border-bottom: 0px" colspan="2">
						<div style="display: flex; justify-content: space-between; " >
							<div>
								<div class="rhead-label-c" style="margin-left: 5mm; margin-right: 2mm">Print Id</div>
								<div class="rhead-value-c" style="width: 25mm"><?=$report_printid?></div>
							</div>
							<div>
								<div class="rhead-label-c">Page</div>
								<div class="rhead-value-c">1</div>
								<div class="rhead-label-c">of</div>
								<div class="rhead-value-c" id="reporttotalpage" style="font-weight: normal">1</div>
							</div>
						</div>
					</td>
					<!-- <td class="rhead-tcol-value-2">......</td> -->
				</tr>

				<tr>
					<td class="rhead-tcol-label-1">Descr</td>
					<td class="rhead-tcol-value-1" colspan="3"><?=$doc_descr?></td>
				</tr>
			</table>
		</div>
		<div id="reporthead-col-qrcode" style="text-align: right; margin-left: 4mm">
			<div style="text-align: center;"><img id="elqrcode" value="<?=$doc_id?>" size="250"></div>
			<div style="text-align: center; font-size: 7pt; margin-top: 2mm">Print Date</div>
			<div style="text-align: center; font-size: 7pt"><?=$report_printdate?></div>
		</div>
	</div>


	<!-- report content -->
	<div id="reportcontent" class="fullwidth">
		<table width="100%">
			<thead>
				<tr>
					<th class="rowhead rptdata-col-no">No</th>
					<th class="rowhead rptdata-col-descr">Descr</th>
				</tr>
			</thead>
			<tbody>
				<!-- 45 -->
				<?php for ($i=1; $i<=70; $i++) { ?>
				<tr>
					<td class="row rptdata-col-no"><?=$i?></td>
					<td class="row rptdata-col-descr">&nbsp;</td>
				</tr>
				<?php } ?>

				<tr>
					<td class="rowfoot">TOTAL</td>
					<td class="rowfoot">&nbsp;</td>
				</tr>				
			</tbody>
			<tfoot>
			</tfoot>			
		</table>
		<script>global.totalrowcount = '<?=($i-1)?>'</script>
	</div>


</div>

<div id="wrapperfooter" class="fullwidth" style="z-index: 20">
	<div id="reportfooter" style="display: flex; justify-content: space-between; height: 50mm; ">
		<div style="width: 30mm;">
			<div style="height: 17mm; font-weight: bold;">Dibuat Oleh,</div>
			<div style="height: 20mm">&nbsp;</div>
			<div style="height: 7mm; border-top: 1px dotted #000"><?=$this->empl_name?></div>		
		</div>
		<div style="flex: 1">
			<div style="height: 10mm; font-weight: bold; margin-left: 10mm">Disetujui Oleh</div>		
			<div style="display: flex; justify-content: space-between; margin-left: 10mm">

			<div style="width: 30mm;">
					<div style="height: 7mm; font-weight: bold;">Manager</div>
					<div style="height: 20mm">&nbsp;</div>
					<div style="height: 7mm; border-top: 1px dotted #000">. . . . </div>		
				</div>
	
			</div>
		</div>
	<div>				
</div>